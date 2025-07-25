using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ShopNowAngular.EntityFrameworkCore.Extensions
{
    public static class DbDataReaderExtensions
    {
        public static T GetObject<T>(this DbDataReader reader) where T : new()
        {
            if (typeof(T) == typeof(int)) // Special handling for single value like int
            {
                if (reader.Read())
                {
                    return (T)Convert.ChangeType(reader.GetValue(0), typeof(T));
                }
                else
                {
                    return default(T);
                }
            }
            else // Handle object mapping
            {
                T obj = new T();

                PropertyInfo[] properties = obj.GetType().GetProperties();

                for (int i = 0; i < reader.FieldCount; i++)
                {
                    string fieldName = reader.GetName(i);
                    string dataType = reader.GetDataTypeName(i);

                    PropertyInfo property = Array.Find(properties, p => p.Name.Equals(fieldName, StringComparison.OrdinalIgnoreCase));


                    if (property != null)
                    {

                        if (property.PropertyType.IsEnum)
                        {
                            if (reader.GetValue(i) != DBNull.Value)
                            {
                                if (Enum.IsDefined(property.PropertyType, reader.GetValue(i)))
                                {
                                    property.SetValue(obj, Enum.ToObject(property.PropertyType, reader.GetValue(i)));
                                }
                            }
                            else
                            {
                                property.SetValue(obj, null);
                            }
                        }
                        else if (property.PropertyType == typeof(TimeOnly) && reader.GetValue(i) is TimeSpan)
                        {
                            property.SetValue(obj, TimeOnly.FromTimeSpan((TimeSpan)reader.GetValue(i)));
                        }
                        else if (property.PropertyType.IsGenericType && property.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>) && reader.GetValue(i) != DBNull.Value)
                        {
                            Type underlyingType = Nullable.GetUnderlyingType(property.PropertyType);

                            if (underlyingType.IsEnum)
                            {
                                if (Enum.IsDefined(underlyingType, reader.GetValue(i)))
                                {
                                    property.SetValue(obj, Enum.ToObject(underlyingType, reader.GetValue(i)));
                                }
                                else
                                {
                                    property.SetValue(obj, null);
                                }
                            }
                            else
                            {
                                property.SetValue(obj, reader.GetValue(i));
                            }
                            if (reader.GetFieldType(i) == typeof(string) && IsCollectionType(property.PropertyType))
                            {
                                string jsonString = reader.GetValue(i).ToString();

                                Type listType = property.PropertyType;
                                Type elementType = listType.GenericTypeArguments[0];

                                object deserializedList = JsonConvert.DeserializeObject(jsonString, typeof(List<>).MakeGenericType(elementType));

                                property.SetValue(obj, deserializedList);
                            }
                        }
                        else
                        {
                            if (reader.GetValue(i) != DBNull.Value)
                            {
                                if (reader.GetFieldType(i) == typeof(string) && IsCollectionType(property.PropertyType))
                                {
                                    string jsonString = reader.GetValue(i).ToString();

                                    Type listType = property.PropertyType;
                                    Type elementType = listType.GenericTypeArguments[0];

                                    object deserializedList = JsonConvert.DeserializeObject(jsonString, typeof(List<>).MakeGenericType(elementType));

                                    property.SetValue(obj, deserializedList);
                                }
                                else
                                {
                                    property.SetValue(obj, reader.GetValue(i));
                                }
                            }
                        }

                    }


                }

                return obj;
            }
        }
        private static bool IsCollectionType(Type type)
        {
            var check = type.IsGenericType && type.GetGenericTypeDefinition() == typeof(List<>);
            return check;
        }
        public static List<T> GetObjects<T>(this DbDataReader reader) where T : new()
        {
            List<T> objects = new List<T>();

            while (reader.Read())
            {
                T obj = reader.GetObject<T>();

                objects.Add(obj);
            }

            return objects;
        }
        public static T GetPrimitiveValue<T>(this DbDataReader reader)
        {
            if (reader.GetValue(0) != DBNull.Value)
            {
                object value = reader.GetValue(0);



                if (typeof(T) == typeof(bool))
                {
                    int intValue = Convert.ToInt32(value);
                    return (T)(object)(intValue != 0);
                }
                else
                {
                    return (T)value;
                }
            }



            return default(T);
        }
    }
}
