using Microsoft.Data.SqlClient;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Extensions
{
    public static class SqlParameterExtensions
{
    public static List<SqlParameter> GetParameters<T>(this T input)
    {
        List<SqlParameter> parameters = new List<SqlParameter>();

        PropertyInfo[] properties = input.GetType().GetProperties();

        foreach (PropertyInfo property in properties)
        {
            string parameterName = $"@{property.Name}";

            SqlDbType dbType = GetSqlDbType(property.PropertyType);

            ParameterDirection direction = ParameterDirection.Input;

            object value = property.GetValue(input);

            if (property.Name == "Sorting" && value != null && !string.IsNullOrWhiteSpace(value.ToString()))
            {
                string[] sort = value.ToString().Split(' ');

                parameters.Add(new SqlParameter("@SortingCol", SqlDbType.NVarChar) { Direction = direction, Value = sort[0] });
                parameters.Add(new SqlParameter("@SortType", SqlDbType.NVarChar) { Direction = direction, Value = sort[1] });
            }
            else if (property.Name == "Keyword")
            {
                if (string.IsNullOrWhiteSpace(value?.ToString()))
                {
                    parameters.Add(new SqlParameter(parameterName, dbType) { Direction = direction, Value = DBNull.Value });
                }
                else
                {
                    parameters.Add(new SqlParameter(parameterName, dbType) { Direction = direction, Value = "%" + value.ToString().Trim() + "%" });
                }
            }
            else if (value == null)
            {
                parameters.Add(new SqlParameter(parameterName, dbType) { Direction = direction, Value = DBNull.Value });
            }
            else if (IsCollectionType(property.PropertyType))
            {
                Type elementType = property.PropertyType.GetGenericArguments()[0];
                string commaSeparatedValues = ConvertCollectionToCommaSeparatedString(value, elementType);
                parameters.Add(new SqlParameter(parameterName, dbType) { Direction = direction, Value = commaSeparatedValues });
            }
            else
            {
                parameters.Add(new SqlParameter(parameterName, dbType) { Direction = direction, Value = value });
            }
        }

        return parameters;
    }

    private static SqlDbType GetSqlDbType(Type type)
    {
        SqlDbType dbType = SqlDbType.NVarChar;

        // ✅ Fix: handle nullable and non-nullable Guid safely
        Type actualType = Nullable.GetUnderlyingType(type) ?? type;

        if (actualType == typeof(Guid))
            return SqlDbType.UniqueIdentifier;

        if (actualType.IsEnum)
            return SqlDbType.Int;

        switch (Type.GetTypeCode(actualType))
        {
            case TypeCode.Boolean:
                return SqlDbType.Bit;
            case TypeCode.Byte:
                return SqlDbType.TinyInt;
            case TypeCode.Int16:
                return SqlDbType.SmallInt;
            case TypeCode.Int32:
                return SqlDbType.Int;
            case TypeCode.Int64:
                return SqlDbType.BigInt;
            case TypeCode.Single:
                return SqlDbType.Real;
            case TypeCode.Double:
                return SqlDbType.Float;
            case TypeCode.Decimal:
                return SqlDbType.Decimal;
            case TypeCode.DateTime:
                return SqlDbType.DateTime;
            case TypeCode.String:
                return SqlDbType.NVarChar;
            default:
                return SqlDbType.NVarChar;
        }
    }

    private static bool IsCollectionType(Type type)
    {
        return type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>);
    }

    private static string ConvertCollectionToCommaSeparatedString(object collection, Type elementType)
    {
        if (elementType == typeof(int))
        {
            return string.Join(",", ((IEnumerable<int>)collection));
        }
        else if (elementType == typeof(Guid))
        {
            return string.Join(",", ((IEnumerable<Guid>)collection).Select(g => g.ToString()));
        }

        return string.Join(",", ((IEnumerable)collection).Cast<object>().Select(e => e.ToString()));
    }
}

}
