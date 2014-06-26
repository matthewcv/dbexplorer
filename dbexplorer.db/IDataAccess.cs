using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dbexplorer.db.Model;

namespace dbexplorer.db
{
    public interface IDataAccess
    {
        Task<TableData> GetData(string server, string database, string table, TableQueryOptions options = null);
    }
}
