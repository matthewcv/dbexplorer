using System;
using System.Threading.Tasks;
using Xunit;

namespace dbexplorer.lib.test
{
    public class SqlServerDatabaseInfoTest
    {
        [Fact]
        public async Task GetDatabase()
        {
            SqlServerDatabaseInfo dbi = new SqlServerDatabaseInfo();

            var database = await dbi.GetDatabase("Data Source=.; Database=WIGOV.DNR.ACSBS; Integrated Security=False; MultipleActiveResultSets=True; User ID=sa; Password=password1!;");

            Assert.NotEmpty(database.Tables);
        }
    }
}
