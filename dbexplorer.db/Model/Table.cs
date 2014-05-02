using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.Model
{
    public class Table
    {
        public string Schema { get;  set; }
        public string Name { get;  set; }
        public string Type { get;  set; }
        public bool IsView { get { return Type.Equals("VIEW", StringComparison.InvariantCultureIgnoreCase); } }

        public List<Column> Columns { get; set; }
        public List<Reference> References { get; set; } 
    }
}
