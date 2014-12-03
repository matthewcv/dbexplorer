using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.Model
{
    public class Server
    {
        public string Name { get; set; }
        public List<Database> Databases { get; set; }
    }
}
