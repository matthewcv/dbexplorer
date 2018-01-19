using System.Threading.Tasks;
using dbexplorer.lib.Model;

namespace dbexplorer.lib
{
    public interface IDatabaseInfo
    {
        Task<Database> GetDatabase(string connection);
    }
}
