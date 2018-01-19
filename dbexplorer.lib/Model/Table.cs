using System.Collections.Generic;

namespace dbexplorer.lib.Model
{
    public class Table
    {
        public string Schema { get; set; }
        public string Name { get; set; }
        public List<Column> Columns { get; set; } = new List<Column>();
        public List<ForeignKey> ForeignKeys { get; set; } = new List<ForeignKey>();
    }
}