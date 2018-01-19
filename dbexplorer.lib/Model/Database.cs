using System.Collections.Generic;

namespace dbexplorer.lib.Model
{
    public class Database
    {

        
        public string Name { get; set; }
        public List<Table> Tables { get; set; } = new List<Table>();
    }
}
