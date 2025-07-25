using ShopNowAngular.Repositories.CartsMannagement.Carts.Dtos;
using System.Threading.Tasks;

namespace ShopNowAngular.Repositories.CartsMannagement.Carts
{
    public interface ICartRepository
    {
        Task<GetAddItemToCartSpDto> GetAddCartItems(AddItemToCartSpDto input);
    }
}
