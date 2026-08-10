namespace BackEnd.Settings
{
    public class TodoDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string TodoCollectionName { get; set; } = null!;
        public string UserCollectionName { get; set; } = null!;
        public string ProjectCollectionName { get; set; } = null!;
    }
}