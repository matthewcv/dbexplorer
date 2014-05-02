using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.Model
{
    public class Reference
    {
        public List<string> FkColumns { get; set; }

        public List<string> PkColumns { get; set; }

        public string PkTableSchema { get; set; }

        public string PkTableName { get; set; }
    }
}
