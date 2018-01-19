namespace dbexplorer.lib.Model
{
    public class Column
    {
        public string Name { get; set; }
        public string DataType { get; set; }
        public bool Nullable { get; set; }
        public int Ordinal { get; set; }
        public bool IsPrimaryKey { get; set; }
    }
}