using System.Threading.Tasks;
using dbexplorer.lib;
using dbexplorer.lib.Model;
using Microsoft.AspNetCore.Mvc;

namespace dbexplorer.web.Controllers
{
    [Route("api/[controller]")]
    public class DatabaseController : Controller
    {
        private readonly IDatabaseInfo _databaseInfo;

        public DatabaseController(IDatabaseInfo databaseInfo)
        {
            _databaseInfo = databaseInfo;
        }
        [HttpGet()]
        public Task<Database> GetDatabase(string connectionString)
        {
            return _databaseInfo.GetDatabase(connectionString);
        }

    }
}
