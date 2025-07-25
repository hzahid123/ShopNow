using Abp.Application.Services.Dto;
using Abp.Data;
using Abp.EntityFrameworkCore;
using ShopNowAngular.Carts;
using ShopNowAngular.Repositories.CartsMannagement.Carts;
using ShopNowAngular.Repositories.CartsMannagement.Carts.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Repositories.CartsManagement.Carts
{
    public class CartRepository : ShopNowAngularRepositoryBase<Cart, Guid>, ICartRepository
    {
        private readonly IDbContextProvider<ShopNowAngularDbContext> _dbContextProvider;
        private readonly IActiveTransactionProvider _transactionProvider;
        public CartRepository(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider) : base(dbContextProvider, transactionProvider)
        {
            _dbContextProvider = dbContextProvider;
            _transactionProvider = transactionProvider;
        }

        public async Task<GetAddItemToCartSpDto> GetAddCartItems(AddItemToCartSpDto input)
           => await ExecuteStoreProcedureWithBoolReturn<AddItemToCartSpDto, GetAddItemToCartSpDto>(input, "[Cart].[AddItemToCart]");

    }
}
