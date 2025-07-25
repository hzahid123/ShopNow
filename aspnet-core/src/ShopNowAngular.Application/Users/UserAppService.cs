using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.Extensions;
using Abp.IdentityFramework;
using Abp.Linq.Extensions;
using Abp.Localization;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShopNowAngular.Authorization;
using ShopNowAngular.Authorization.Roles;
using ShopNowAngular.Authorization.Users;
using ShopNowAngular.Carts;
using ShopNowAngular.Emails;
using ShopNowAngular.Emails.Dtos;
using ShopNowAngular.Enums;
using ShopNowAngular.orders;
using ShopNowAngular.Products;
using ShopNowAngular.Repositories.ProductManagement.Products.Dtos;
using ShopNowAngular.Repositories.Users;
using ShopNowAngular.Repositories.Users.Dtos;
using ShopNowAngular.Roles.Dto;
using ShopNowAngular.StoreFollowers;
using ShopNowAngular.StoreRequests;
using ShopNowAngular.Stores;
using ShopNowAngular.Stores.Dtos;
using ShopNowAngular.Users.Dto;
using ShopNowAngular.WishlistItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopNowAngular.Users
{
    [AbpAuthorize(PermissionNames.Pages_Users)]
    public class UserAppService : AsyncCrudAppService<User, UserDto, long, PagedUserResultRequestDto, CreateUserDto, UserDto>, IUserAppService
    {
        private readonly UserManager _userManager;
        private readonly RoleManager _roleManager;
        private readonly IRepository<Role> _roleRepository;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IAbpSession _abpSession;
        private readonly LogInManager _logInManager;
        private readonly IStoreAppService _storeAppService;
        private readonly IEmailAppService _emailAppService;
        private readonly IRepository<StoreRequest, Guid> _storeRequestRepo;
        private readonly IRepository<Store, Guid> _storeRepo;
        private readonly IRepository<Product, Guid> _producrRepository;
        private readonly IRepository<WishlistItem, Guid> _WishlistItemRepository;
        private readonly IRepository<OrderItem, Guid> _orderItemRepository;
        private readonly IRepository<CartItem, Guid> _cartItemRepository;
        private readonly IRepository<StoreFollower, Guid> _StoreFollowersRepository;
        private readonly IUserRepository _userRepository;

        public UserAppService(
            IRepository<User, long> repository,
            UserManager userManager,
            RoleManager roleManager,
            IRepository<Role> roleRepository,
            IPasswordHasher<User> passwordHasher,
            IAbpSession abpSession,
            LogInManager logInManager,
            IStoreAppService storeAppService,
            IEmailAppService emailAppService,
            IUserRepository userRepository,
            IRepository<StoreRequest,Guid> storeRequestRepo,
            IRepository<Store, Guid> storeRepo,
             IRepository<Product, Guid> producrRepository,
             IRepository<WishlistItem, Guid> WishlistItemRepository,
             IRepository<OrderItem, Guid> orderItemRepository,
             IRepository<CartItem, Guid> cartItemRepository,
              IRepository<StoreFollower, Guid> StoreFollowersRepository)
            : base(repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _roleRepository = roleRepository;
            _passwordHasher = passwordHasher;
            _abpSession = abpSession;
            _logInManager = logInManager;
            _storeAppService = storeAppService;
            _emailAppService = emailAppService;
            _storeRequestRepo = storeRequestRepo;
            _storeRepo = storeRepo;
            _producrRepository = producrRepository;
            _orderItemRepository = orderItemRepository;
            _cartItemRepository = cartItemRepository;
            _StoreFollowersRepository = StoreFollowersRepository;
            _WishlistItemRepository = WishlistItemRepository;
            _userRepository = userRepository;

        }

        public override async Task<UserDto> CreateAsync(CreateUserDto input)
        {
            CheckCreatePermission();

            var user = ObjectMapper.Map<User>(input);
            user.TenantId = AbpSession.TenantId;
            user.IsEmailConfirmed = true;

            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);
            CheckErrors(await _userManager.CreateAsync(user, input.Password));

            var assignedRoles = input.RoleNames ?? new string[] { await SetStaticRolesForUserType(input.UserType) };
            CheckErrors(await _userManager.SetRolesAsync(user, assignedRoles));
            CurrentUnitOfWork.SaveChanges();

            return MapToEntityDto(user);
        }


        public async Task<string> SetStaticRolesForUserType(UserType input)
        {
            switch (input)
            {
                case UserType.SuperAdmin:
                    return await _roleRepository.GetAll()
                                                       .Where(r => r.Name.Equals(StaticRoleNames.Tenants.SuperAdmin))
                                                       .Select(r => r.Name)
                                                       .FirstOrDefaultAsync();
                case UserType.Admin:
                    return await _roleRepository.GetAll()
                                                       .Where(r => r.Name.Equals(StaticRoleNames.Tenants.Admin))
                                                       .Select(r => r.Name)
                                                       .FirstOrDefaultAsync();
                case UserType.StoreOwner:
                    return await _roleRepository.GetAll()
                                                       .Where(r => r.Name.Equals(StaticRoleNames.Tenants.StoreOwner))
                                                       .Select(r => r.Name)
                                                       .FirstOrDefaultAsync();
                case UserType.Customer:
                    return await _roleRepository.GetAll()
                                                       .Where(r => r.Name.Equals(StaticRoleNames.Tenants.Customer))
                                                       .Select(r => r.Name)
                                                       .FirstOrDefaultAsync();
            }
            return string.Empty;
        }

        public async Task<PagedResultDto<GetUserSpDto>> GetAllUsers(PagedUserResultRequestSpDto input)
        {
            var data = await _userRepository.GetAllUsersSP(input);
            return data;
        }
        public async Task<GetStoreDto> ApproveStoreRequest(Guid storeRequestId)
        {
            if (storeRequestId == Guid.Empty)
            {
                throw new UserFriendlyException("Invalid store request ID.");
            }

            var storeRequest = await _storeRequestRepo.FirstOrDefaultAsync(storeRequestId);
            if (storeRequest == null)
            {
                throw new UserFriendlyException("Store request not found.");
            }

            if (storeRequest.StorerequestStatus != StoreRequestStatus.Pending)
            {
                throw new UserFriendlyException("Store request has already been processed.");
            }

            var existingUser = await _userManager.FindByEmailAsync(storeRequest.OwnerEmail);
            if (existingUser != null)
            {
                throw new UserFriendlyException($"A user with email '{storeRequest.OwnerEmail}' already exists.");
            }

            var duplicateStore = await _storeRepo.FirstOrDefaultAsync(s => s.Name == storeRequest.StoreName);
            if (duplicateStore != null)
            {
                throw new UserFriendlyException($"A store with the name '{storeRequest.StoreName}' already exists.");
            }

            // ✅ Auto-generate user
            var password = User.CreateRandomPassword();
            var storeOwnerDto = new CreateUserDto
            {
                UserName = await GenerateUniqueUsernameFromEmailAsync(storeRequest.OwnerEmail),
                Name = storeRequest.OwnerName,
                Surname = storeRequest.OwnerSurname,
                EmailAddress = storeRequest.OwnerEmail,
                Password = password,
                IsActive = true,
                UserType = UserType.StoreOwner,
                RoleNames = new[] { "StoreOwner" },
            };

            UserDto storeOwner;

            using (var uow = UnitOfWorkManager.Begin())
            {
                // ✅ Create store owner user
                storeOwner = await CreateAsync(storeOwnerDto);

                // ✅ Create store
                var createStoreDto = new CreateStoreDto
                {
                    Name = storeRequest.StoreName,
                    OwnerId = storeOwner.Id
                };

                await _storeAppService.CreateAsync(createStoreDto);

                // ✅ Update store request
                storeRequest.StoreOwnerId = storeOwner.Id;
                storeRequest.StorerequestStatus = StoreRequestStatus.Approved;
                await _storeRequestRepo.UpdateAsync(storeRequest);

                await uow.CompleteAsync();
            }

            // ✅ Confirm store exists
            var createdStore = await _storeRepo.FirstOrDefaultAsync(s => s.OwnerId == storeOwner.Id);
            if (createdStore == null)
            {
                throw new UserFriendlyException("Store creation failed.");
            }

            // ✅ Send notification email
            var emailDto = new CreateEmailDto
            {
                UserName = storeOwner.UserName,
                EmailAddress = storeOwner.EmailAddress,
                Password = password,
                MailStatusMessage = $"Congratulations! Your store '{storeRequest.StoreName}' has been successfully approved and created."
            };
            await _emailAppService.SendEmailForStoreOwnerCreation(emailDto);

            // ✅ Return store info
            return ObjectMapper.Map<GetStoreDto>(createdStore);
        }


        private async Task<string> GenerateUniqueUsernameFromEmailAsync(string email)
        {
            var baseUserName = email.Split('@')[0].ToLowerInvariant()
                .Replace(".", "")
                .Replace("_", "")
                .Replace("-", "");

            var random = new Random();
            string candidateUserName;
            bool exists;
            int attempt = 0;

            do
            {
                string suffix = attempt == 0 ? "" : random.Next(1000, 9999).ToString();
                candidateUserName = baseUserName + suffix;
                exists = await _userManager.Users.AnyAsync(u => u.UserName == candidateUserName);
                attempt++;
            }
            while (exists);

            return candidateUserName;
        }




        public override async Task<UserDto> UpdateAsync(UserDto input)
        {
            CheckUpdatePermission();

            var user = await _userManager.GetUserByIdAsync(input.Id);

            MapToEntity(input, user);

            CheckErrors(await _userManager.UpdateAsync(user));

            if (input.RoleNames != null)
            {
                CheckErrors(await _userManager.SetRolesAsync(user, input.RoleNames));
            }

            return await GetAsync(input);
        }

         

        public override async Task DeleteAsync(EntityDto<long> input)
        {
            var userId = input.Id;

            // Step 1: Get user
            var user = await _userManager.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new UserFriendlyException("User not found.");
            }

            // Step 2: If user is store owner, clean up related store data
            var store = await _storeRepo.FirstOrDefaultAsync(s => s.OwnerId == userId && !s.IsDeleted);
            if (store != null)
            {
                var storeId = store.Id;

                // 2.1 Get all product IDs from this store
                var productIds = await _producrRepository.GetAll()
                    .Where(p => p.StoreId == storeId && !p.IsDeleted)
                    .Select(p => p.Id)
                    .ToListAsync();

                // 2.2 Delete WishlistItems related to store's products
                await _WishlistItemRepository.DeleteAsync(x => productIds.Contains(x.ProductId));

                // 2.3 Delete CartItems related to store's products
                await _cartItemRepository.DeleteAsync(x => productIds.Contains(x.ProductId));

                // 2.4 Delete OrderItems related to store's products
                await _orderItemRepository.DeleteAsync(x => productIds.Contains(x.ProductId));

                // 2.5 Delete Products from store
                await _producrRepository.DeleteAsync(x => x.StoreId == storeId);

                // 2.6 Delete StoreFollowers
                await _StoreFollowersRepository.DeleteAsync(x => x.StoreId == storeId);

                // 2.7 Delete StoreRequests by StoreOwnerId
                await _storeRequestRepo.DeleteAsync(x => x.StoreOwnerId == userId);


                // 2.8 Delete Store
                await _storeRepo.DeleteAsync(store);
            }

            // Step 3: Delete the user (original logic)
            await _userManager.DeleteAsync(user);
        }







        [AbpAuthorize(PermissionNames.Pages_Users_Activation)]
        public async Task Activate(EntityDto<long> user)
        {
            await Repository.UpdateAsync(user.Id, async (entity) =>
            {
                entity.IsActive = true;
            });
        }

        [AbpAuthorize(PermissionNames.Pages_Users_Activation)]
        public async Task DeActivate(EntityDto<long> user)
        {
            await Repository.UpdateAsync(user.Id, async (entity) =>
            {
                entity.IsActive = false;
            });
        }

        public async Task<ListResultDto<RoleDto>> GetRoles()
        {
            var roles = await _roleRepository.GetAllListAsync();
            return new ListResultDto<RoleDto>(ObjectMapper.Map<List<RoleDto>>(roles));
        }

        public async Task ChangeLanguage(ChangeUserLanguageDto input)
        {
            await SettingManager.ChangeSettingForUserAsync(
                AbpSession.ToUserIdentifier(),
                LocalizationSettingNames.DefaultLanguage,
                input.LanguageName
            );
        }

        protected override User MapToEntity(CreateUserDto createInput)
        {
            var user = ObjectMapper.Map<User>(createInput);
            user.SetNormalizedNames();
            return user;
        }

        protected override void MapToEntity(UserDto input, User user)
        {
            ObjectMapper.Map(input, user);
            user.SetNormalizedNames();
        }

        protected override UserDto MapToEntityDto(User user)
        {
            var roleIds = user.Roles.Select(x => x.RoleId).ToArray();

            var roles = _roleManager.Roles.Where(r => roleIds.Contains(r.Id)).Select(r => r.NormalizedName);

            var userDto = base.MapToEntityDto(user);
            userDto.RoleNames = roles.ToArray();

            return userDto;
        }

        protected override IQueryable<User> CreateFilteredQuery(PagedUserResultRequestDto input)
        {
            return Repository.GetAllIncluding(x => x.Roles)
                .WhereIf(!input.Keyword.IsNullOrWhiteSpace(), x => x.UserName.Contains(input.Keyword) || x.Name.Contains(input.Keyword) || x.EmailAddress.Contains(input.Keyword))
                .WhereIf(input.IsActive.HasValue, x => x.IsActive == input.IsActive);
        }

        protected override async Task<User> GetEntityByIdAsync(long id)
        {
            var user = await Repository.GetAllIncluding(x => x.Roles).FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
            {
                throw new EntityNotFoundException(typeof(User), id);
            }

            return user;
        }

        protected override IQueryable<User> ApplySorting(IQueryable<User> query, PagedUserResultRequestDto input)
        {
            return query.OrderBy(r => r.UserName);
        }

        protected virtual void CheckErrors(IdentityResult identityResult)
        {
            identityResult.CheckErrors(LocalizationManager);
        }

        public async Task<bool> ChangePassword(ChangePasswordDto input)
        {
            await _userManager.InitializeOptionsAsync(AbpSession.TenantId);

            var user = await _userManager.FindByIdAsync(AbpSession.GetUserId().ToString());
            if (user == null)
            {
                throw new Exception("There is no current user!");
            }
            
            if (await _userManager.CheckPasswordAsync(user, input.CurrentPassword))
            {
                CheckErrors(await _userManager.ChangePasswordAsync(user, input.NewPassword));
            }
            else
            {
                CheckErrors(IdentityResult.Failed(new IdentityError
                {
                    Description = "Incorrect password."
                }));
            }

            return true;
        }



        [AbpAllowAnonymous]
        public async Task<User> GetUserEntityByNameAndEmail(string usernameAndEmail)
        {
            var user = await Repository.GetAll()
                                       .Where(u => u.EmailAddress == usernameAndEmail && u.IsActive)
                                       .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            var storeId = await _storeRepo.GetAll()
                                          .Where(s => s.OwnerId == user.Id)
                                          .Select(s => s.Id)
                                          .FirstOrDefaultAsync();

            user.StoreId = storeId == Guid.Empty ? (Guid?)null : storeId;

            return user;
        }


        [AbpAllowAnonymous]
        public async Task<bool?> GetTwoFactorAuthCheck(long userId)
        {
            return await Repository.GetAll()
                .Where(u => u.Id == userId)
                .Select(u => (bool?)u.TwoFactorAuthCheck)
                .FirstOrDefaultAsync();
        }
        public async Task SetTwoFactorAuthCheck(long userId, bool value)
        {
            var user = await Repository.FirstOrDefaultAsync(userId);
            if (user != null)
            {
                user.TwoFactorAuthCheck = value;
                await Repository.UpdateAsync(user);
            }
        }

        public async Task<bool> ResetPassword(ResetPasswordDto input)
        {
            if (_abpSession.UserId == null)
            {
                throw new UserFriendlyException("Please log in before attempting to reset password.");
            }
            
            var currentUser = await _userManager.GetUserByIdAsync(_abpSession.GetUserId());
            var loginAsync = await _logInManager.LoginAsync(currentUser.UserName, input.AdminPassword, shouldLockout: false);
            if (loginAsync.Result != AbpLoginResultType.Success)
            {
                throw new UserFriendlyException("Your 'Admin Password' did not match the one on record.  Please try again.");
            }
            
            if (currentUser.IsDeleted || !currentUser.IsActive)
            {
                return false;
            }

            var roles = await _userManager.GetRolesAsync(currentUser);
            if (!roles.Contains(StaticRoleNames.Tenants.SuperAdmin) && !roles.Contains(StaticRoleNames.Tenants.Admin))
            {
                throw new UserFriendlyException("Only administrators may reset passwords.");
            }


            var user = await _userManager.GetUserByIdAsync(input.UserId);
            if (user != null)
            {
                user.Password = _passwordHasher.HashPassword(user, input.NewPassword);
                await CurrentUnitOfWork.SaveChangesAsync();
            }

            return true;
        }

        public async Task<List<GetTotalUsersSpDto>> GetTotalUsers(PagedTotalUsersResultRequestSpDto input)
        {
            var data = await _userRepository.GetTotalUsersSp(input);
            return data;
        }

    }
}

