using Abp.Domain.Entities;
using Abp.Domain.Repositories;
using Abp.EntityFrameworkCore;
using Abp.EntityFrameworkCore.Repositories;
using Abp.Data;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using System.Data;
using System.Threading.Tasks;
using ShopNowAngular.EntityFrameworkCore.Extensions;
using Abp.Application.Services.Dto;
using System.Collections.Generic;

namespace ShopNowAngular.EntityFrameworkCore.Repositories
{
    /// <summary>
    /// Base class for custom repositories of the application.
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    /// <typeparam name="TPrimaryKey">Primary key type of the entity</typeparam>
    public abstract class ShopNowAngularRepositoryBase<TEntity, TPrimaryKey> : EfCoreRepositoryBase<ShopNowAngularDbContext, TEntity, TPrimaryKey>
        where TEntity : class, IEntity<TPrimaryKey>
    {
        protected ShopNowAngularRepositoryBase(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        protected readonly IActiveTransactionProvider _transactionProvider;

        protected ShopNowAngularRepositoryBase(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider, IActiveTransactionProvider transactionProvider)
            : base(dbContextProvider)
        {
            _transactionProvider = transactionProvider;
        }

        // Add your common methods for all repositories

        protected async Task<List<TOutput>> ExecuteSearchStoreProcedureWithOutPagination<TInput, TOutput>(TInput input, string spName)
            where TInput : class
            where TOutput : class, new()
        {
            List<TOutput> outputDtos = new List<TOutput>();
            using (var command = CreateCommand(spName, CommandType.StoredProcedure, _transactionProvider, input.GetParameters().ToArray()))
            {
                using (DbDataReader dataReader = await command.ExecuteReaderAsync())
                {
                    outputDtos = dataReader.GetObjects<TOutput>();
                }
            }
            return outputDtos;
        }

        protected async Task<TOutput> ExecuteSearchStoreProcedureWithoutPagedResultDto<TInput, TOutput>(TInput input, string spName)
            where TInput : class
            where TOutput : class, new()
        {
            TOutput outputDtos = new TOutput();
            using (var command = CreateCommand(spName, CommandType.StoredProcedure, _transactionProvider, input.GetParameters().ToArray()))
            {
                using (DbDataReader dataReader = await command.ExecuteReaderAsync())
                {
                    if (await dataReader.ReadAsync())
                        outputDtos = dataReader.GetObject<TOutput>();
                }
            }
            return outputDtos;
        }

        protected async Task<PagedResultDto<TOutput>> ExecuteSearchStoreProcedure<TInput, TOutput>(TInput input, string spName)
            where TInput : class
            where TOutput : class, new()
        {
            List<TOutput> outputDtos = new List<TOutput>();
            int count = 0;

            using (var command = CreateCommand(spName, CommandType.StoredProcedure, _transactionProvider, input.GetParameters().ToArray()))
            {
                using (DbDataReader dataReader = await command.ExecuteReaderAsync())
                {
                    outputDtos = dataReader.GetObjects<TOutput>();

                    // Check if there's another result set for the count (if present)
                    if (dataReader.NextResult())
                    {
                        count = dataReader.GetObject<int>();
                    }
                }
            }

            return new PagedResultDto<TOutput>(count, outputDtos);
        }

        protected async Task<TOutput> ExecuteStoreProcedureWithBoolReturn<TInput, TOutput>(TInput input, string spName)
            where TInput : class
            where TOutput : class, new()
        {
            TOutput outputDtos = default(TOutput);
            using (var command = CreateCommand(spName, CommandType.StoredProcedure, _transactionProvider, input.GetParameters().ToArray()))
            {
                using (DbDataReader dataReader = await command.ExecuteReaderAsync())
                {
                    if (await dataReader.ReadAsync())
                        outputDtos = dataReader.GetPrimitiveValue<TOutput>();
                }
            }
            return outputDtos;
        }

        protected DbCommand CreateCommand(string commandText, CommandType commandType, IActiveTransactionProvider activeTransactionProvider,
            params SqlParameter[] parameters)
        {
            var command = this.GetDbContext().Database.GetDbConnection().CreateCommand();
            command.CommandText = commandText;
            command.CommandType = commandType;
            command.Transaction = GetActiveTransaction(activeTransactionProvider);

            foreach (SqlParameter parameter in parameters)
            {
                DbParameter dbParameter = command.CreateParameter();
                dbParameter.ParameterName = parameter.ParameterName;
                dbParameter.DbType = parameter.DbType;
                dbParameter.Direction = parameter.Direction;
                dbParameter.Value = parameter.Value;
                command.Parameters.Add(dbParameter);
            }

            return command;
        }

        private DbTransaction GetActiveTransaction(IActiveTransactionProvider _transactionProvider)
        {
            return (DbTransaction)_transactionProvider.GetActiveTransaction(new ActiveTransactionProviderArgs
            {
                { "ContextType", typeof(ShopNowAngularDbContext) },
                { "MultiTenancySide", MultiTenancySide }
            });
        }
    }

    /// <summary>
    /// Base class for custom repositories of the application.
    /// This is a shortcut of <see cref="ShopNowAngularRepositoryBase{TEntity,TPrimaryKey}"/> for <see cref="int"/> primary key.
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    public abstract class ShopNowAngularRepositoryBase<TEntity> : ShopNowAngularRepositoryBase<TEntity, int>, IRepository<TEntity>
        where TEntity : class, IEntity<int>
    {
        protected ShopNowAngularRepositoryBase(IDbContextProvider<ShopNowAngularDbContext> dbContextProvider)
            : base(dbContextProvider)
        {
        }

        // Do not add any method here, add to the class above (since this inherits it)!!!
    }
}
