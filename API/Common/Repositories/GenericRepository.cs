using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Common.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class, new()
    {
        private readonly SqlConnection _connection;

        public GenericRepository(SqlConnection connection)
        {
            _connection = connection;
        }

        #region GetAll Method
        public IEnumerable<T> GetAll()
        {
            var results = new List<T>();
            var tableName = GetTableName();

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = $"SELECT * FROM {tableName}";
                Console.WriteLine($"Executing SQL: {command.CommandText}"); // Log command text

                try
                {
                    _connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var entity = new T();
                            PopulateObjectFromReader(reader, entity);
                            results.Add(entity);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}"); // Log the error message
                    throw new ApplicationException($"An error occurred while fetching all records from {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }
            return results;
        }
        #endregion

        #region GetByName Method
        public T GetByName(string name)
        {
            var tableName = GetTableName();
            T entity = null;

            using (var command = _connection.CreateCommand())
            {
                // Assuming you want to fetch a company by its CompanyName
                command.CommandText = $"SELECT * FROM {tableName} WHERE email = @Name";
                command.Parameters.AddWithValue("@Name", name);

                try
                {
                    _connection.Open();
                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            entity = new T();
                            PopulateObjectFromReader(reader, entity);
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new RepositoryException($"An error occurred while fetching record with name {name} from {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }

            return entity;
        }
        #endregion

        #region GetById Method
        /*  public T GetById(int id)
          {
              var tableName = GetTableName();
              T entity = null;

              using (var command = _connection.CreateCommand())
              {
                  command.CommandText = $"SELECT * FROM {tableName} WHERE Id = @Id";
                  command.Parameters.AddWithValue("@Id", id);

                  try
                  {
                      _connection.Open();
                      using (var reader = command.ExecuteReader())
                      {
                          if (reader.Read())
                          {
                              entity = new T();
                              PopulateObjectFromReader(reader, entity);

                          }
                      }
                  }
                  catch (Exception ex)
                  {
                      throw new RepositoryException($"An error occurred while fetching record with Id {id} from {tableName}.", ex);
                  }
                  finally
                  {
                      _connection.Close();
                  }
              }

              return entity;
          }*/

        public T[] GetById(int id, bool isPrimaryKey, string columnName)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Invalid ID provided.", nameof(id));
            }

            var tableName = GetTableName();
            var entities = new List<T>();

            using (var command = _connection.CreateCommand())
            {
                if (isPrimaryKey)
                {
                    command.CommandText = $"SELECT * FROM {tableName} WHERE Id = @Id";
                }
                else
                {
                    command.CommandText = $"SELECT * FROM {tableName} WHERE {columnName} = @Id";
                }
                command.Parameters.AddWithValue("@Id", id);

                try
                {
                    _connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var entity = Activator.CreateInstance<T>(); // Instantiate the entity dynamically
                            PopulateObjectFromReader(reader, entity);
                            entities.Add(entity);
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw new RepositoryException($"An error occurred while fetching records from {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }

            return entities.ToArray();
        }



        #endregion

        #region Add Method
        public void Add(T entity)
        {
            var tableName = GetTableName();
            var insertQuery = GenerateInsertQuery(entity, tableName);

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = insertQuery;

                // Set parameter values for the insert query
                foreach (var property in typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    // Skip the identity column
                    if (property.Name == "Id" || property.GetCustomAttributes(typeof(JsonIgnoreAttribute), false).Any())
                        continue;

                    // Get the Column attribute if it exists, otherwise use the property name
                    var columnAttribute = property.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;
                    var columnName = columnAttribute?.Name ?? property.Name;

                    // Get the property value
                    var value = property.GetValue(entity);

                    // Check if the property is of type int or nullable int and has a value of 0
                    if ((property.PropertyType == typeof(int) || property.PropertyType == typeof(int?)) && Convert.ToInt32(value) == 0)
                    {
                        // Set NULL if the integer value is 0
                        command.Parameters.AddWithValue($"@{columnName}", DBNull.Value);
                    }
                    else
                    {
                        command.Parameters.AddWithValue($"@{columnName}", value ?? DBNull.Value);
                    }
                }

                try
                {
                    _connection.Open();
                    command.ExecuteNonQuery();

                }
                catch (Exception ex)
                {
                    throw new RepositoryException($"An error occurred while adding a new record to {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }
        }
        #endregion

        #region Update Method
        /*public void Update(T entity)
        {
            var tableName = GetTableName();
            var updateQuery = GenerateUpdateQuery(entity, tableName);

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = updateQuery;

                // Set parameter values for the update query
                foreach (var property in typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    // Skip the identity column
                    if (property.Name == "Id")
                        continue;
                    var columnAttribute = property.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;
                    var columnName = columnAttribute?.Name ?? property.Name;

                    var value = property.GetValue(entity);
                    command.Parameters.AddWithValue($"@{columnName}", value ?? DBNull.Value);
                }

                // Add the Id parameter
                var idProperty = typeof(T).GetProperty("Id");
                if (idProperty != null)
                {
                    var idValue = idProperty.GetValue(entity);
                    command.Parameters.AddWithValue("@Id", idValue);
                }

                try
                {
                    _connection.Open();
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    throw new RepositoryException($"An error occurred while updating a record in {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }
        }*/

        public bool Update(T entity)
        {
            var tableName = GetTableName();
            var updateQuery = GenerateUpdateQuery(entity, tableName);

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = updateQuery;

                // Set parameter values for the update query
                foreach (var property in typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance))
                {
                    // Skip the identity column
                    if (property.Name == "Id")
                        continue;

                    var columnAttribute = property.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;
                    var columnName = columnAttribute?.Name ?? property.Name;

                    var value = property.GetValue(entity);
                    command.Parameters.AddWithValue($"@{columnName}", value ?? DBNull.Value);
                }

                // Add the Id parameter
                var idProperty = typeof(T).GetProperty("Id");
                if (idProperty != null)
                {
                    var idValue = idProperty.GetValue(entity);
                    command.Parameters.AddWithValue("@Id", idValue);
                }

                try
                {
                    _connection.Open();
                    var rowsAffected = command.ExecuteNonQuery();
                    return rowsAffected > 0; // Return true if rows were affected
                }
                catch (Exception ex)
                {
                    throw new RepositoryException($"An error occurred while updating a record in {tableName}.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }
        }


        #endregion


        #region Delete Method

        public bool Delete(int id)
        {
            var tableName = GetTableName();
            // Get actual column name for "Id"
            var keyProperty = typeof(T).GetProperty("Id");
            var columnAttr = keyProperty.GetCustomAttributes(typeof(ColumnAttribute), false)
                                        .FirstOrDefault() as ColumnAttribute;
            var columnName = columnAttr != null ? columnAttr.Name : "Id";

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = $"DELETE FROM {tableName} WHERE Id = @Id";
                command.Parameters.AddWithValue("@Id", id);

                try
                {
                    _connection.Open();
                    int affectedRows = command.ExecuteNonQuery();
                    if (affectedRows > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
                finally
                {
                    _connection.Close();
                }
            }
        }

        #endregion

        #region GenerateInsertQuery Method
        private string GenerateInsertQuery(T entity, string tableName)
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // Generate column names and parameter names
            var columnNames = new List<string>();
            var parameterNames = new List<string>();

            foreach (var property in properties)
            {
                if (property.Name == "Id" || property.GetCustomAttributes(typeof(JsonIgnoreAttribute), false).Any())
                    continue;
                // Get the Column attribute if it exists, otherwise use the property name
                var columnAttribute = property.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;
                var columnName = columnAttribute?.Name ?? property.Name;

                columnNames.Add(columnName);
                parameterNames.Add($"@{columnName}");
            }

            var columns = string.Join(", ", columnNames);
            var parameters = string.Join(", ", parameterNames);

            var query = $"INSERT INTO {tableName} ({columns}) VALUES ({parameters})";

            return query;
        }

        #endregion

        #region GenerateUpdateQuery Method
        private string GenerateUpdateQuery(T entity, string tableName)
        {
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            // Filter out properties that might be auto-generated (e.g., Id) or null
            var columnValuePairs = properties
                .Where(p => p.GetValue(entity) != null && p.Name != "Id")
                .Select(p =>
                {
                    // Check if the property has a Column attribute
                    var columnAttribute = p.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;
                    var columnName = columnAttribute?.Name ?? p.Name; // Use the column name from the attribute or fallback to the property name

                    return $"{columnName} = @{columnName}";
                })
                .ToArray();

            var columnValueString = string.Join(", ", columnValuePairs);

            // Assuming there's an Id property used as the key
            var query = $"UPDATE {tableName} SET {columnValueString} WHERE Id = @Id";

            return query;
        }


        #endregion

        #region Helper method to get the correct table name
        private string GetTableName()
        {
            // Check for the [Table] attribute on the class
            var tableAttribute = typeof(T).GetCustomAttribute<TableAttribute>();
            if (tableAttribute != null && !string.IsNullOrEmpty(tableAttribute.Name))
            {
                return tableAttribute.Name; // Use the custom table name specified in the attribute
            }

            // Fallback to the model name with "s" appended if no [Table] attribute is found
            var typeName = typeof(T).Name;
            var tableName = TableExists(typeName + "s") ? typeName + "s" : typeName;
            Console.WriteLine($"Determined table name: {tableName}");
            return tableName;
        }
        #endregion



        #region Helper method to check if the table exists in the database
        private bool TableExists(string tableName)
        {
            using (var command = _connection.CreateCommand())
            {
                command.CommandText = "SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = @TableName";
                command.Parameters.AddWithValue("@TableName", tableName);

                try
                {
                    _connection.Open();
                    return command.ExecuteScalar() != null;
                }
                catch (Exception)
                {
                    return false; // Handle/log error as necessary
                }
                finally
                {
                    _connection.Close();
                }
            }
        }

        #endregion


        #region Helper method to populate entity properties from a data reader

        private void PopulateObjectFromReader(SqlDataReader reader, T entity)
        {
            foreach (var property in typeof(T).GetProperties(BindingFlags.Instance | BindingFlags.Public))
            {
                // Get the Column attribute if it exists
                var columnAttribute = property.GetCustomAttributes(typeof(ColumnAttribute), false).FirstOrDefault() as ColumnAttribute;

                // Use the custom column name if the Column attribute exists, otherwise use the property name
                var columnName = columnAttribute?.Name ?? property.Name;

                try
                {
                    // Check if the column exists by using GetOrdinal (throws IndexOutOfRangeException if not found)
                    int columnIndex = reader.GetOrdinal(columnName);

                    if (!reader.IsDBNull(columnIndex))
                    {
                        // Handle type conversion before setting the property value
                        var value = Convert.ChangeType(reader[columnIndex], property.PropertyType);
                        property.SetValue(entity, value);
                    }
                    else
                    {
                        Console.WriteLine($"Column {columnName} is NULL for entity with Id {reader["Id"]}.");
                    }
                }
                catch (IndexOutOfRangeException)
                {
                    Console.WriteLine($"Column {columnName} not found in the result set for entity.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error setting value for {columnName}: {ex.Message}");
                }
            }
        }

        #endregion

        #region ExecuteQuery Method
        public IEnumerable<T> ExecuteQuery(string sql, object parameters = null)
        {
            var results = new List<T>();

            using (var command = _connection.CreateCommand())
            {
                command.CommandText = sql;

                // Add parameters if they exist
                if (parameters != null)
                {
                    foreach (var property in parameters.GetType().GetProperties())
                    {
                        command.Parameters.AddWithValue("@" + property.Name, property.GetValue(parameters));
                    }
                }

                try
                {
                    _connection.Open();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            // Assuming T has a parameterless constructor and public setters
                            var obj = Activator.CreateInstance<T>();

                            foreach (var property in typeof(T).GetProperties())
                            {
                                if (!reader.IsDBNull(reader.GetOrdinal(property.Name)))
                                {
                                    property.SetValue(obj, reader.GetValue(reader.GetOrdinal(property.Name)));
                                }
                            }

                            results.Add(obj);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log or handle the exception as needed
                    throw new RepositoryException("An error occurred while executing the query.", ex);
                }
                finally
                {
                    _connection.Close();
                }
            }

            return results;
        }

        #endregion


    }


    // Custom exception class for repository-related exceptions
    public class RepositoryException : Exception
    {
        public RepositoryException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}
