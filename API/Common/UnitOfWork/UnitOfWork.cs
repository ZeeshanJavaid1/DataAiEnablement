using Common.Repositories;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SqlConnection _connection;
        private SqlTransaction _transaction;


        public UnitOfWork(SqlConnection connection)
        {
            _connection = connection;

        }

        public IGenericRepository<T> GetRepository<T>() where T : class, new()
        {
            return new GenericRepository<T>(_connection);
        }

        public void Commit()
        {
            try
            {
                _transaction?.Commit();
            }
            catch
            {
                Rollback();
                throw;
            }
        }

        public void Rollback()
        {
            _transaction?.Rollback();
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _connection.Dispose();
        }

        public void BeginTransaction()
        {
            if (_connection.State != System.Data.ConnectionState.Open)
            {
                _connection.Open();  // Ensure the connection is open
            }
            _transaction = _connection.BeginTransaction();
        }
    }
}
