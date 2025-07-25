FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/ShopNowAngular.Web.Host/ShopNowAngular.Web.Host.csproj", "src/ShopNowAngular.Web.Host/"]
COPY ["src/ShopNowAngular.Web.Core/ShopNowAngular.Web.Core.csproj", "src/ShopNowAngular.Web.Core/"]
COPY ["src/ShopNowAngular.Application/ShopNowAngular.Application.csproj", "src/ShopNowAngular.Application/"]
COPY ["src/ShopNowAngular.Core/ShopNowAngular.Core.csproj", "src/ShopNowAngular.Core/"]
COPY ["src/ShopNowAngular.EntityFrameworkCore/ShopNowAngular.EntityFrameworkCore.csproj", "src/ShopNowAngular.EntityFrameworkCore/"]
WORKDIR "/src/src/ShopNowAngular.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/ShopNowAngular.Web.Host", "src/ShopNowAngular.Web.Host"]
COPY ["src/ShopNowAngular.Web.Core", "src/ShopNowAngular.Web.Core"]
COPY ["src/ShopNowAngular.Application", "src/ShopNowAngular.Application"]
COPY ["src/ShopNowAngular.Core", "src/ShopNowAngular.Core"]
COPY ["src/ShopNowAngular.EntityFrameworkCore", "src/ShopNowAngular.EntityFrameworkCore"]
WORKDIR "/src/src/ShopNowAngular.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "ShopNowAngular.Web.Host.dll"]
