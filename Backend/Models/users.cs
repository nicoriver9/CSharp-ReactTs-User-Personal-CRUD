public class User
{
    public int id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool IsActive { get; set; } 
    public string Role { get; set; } = string.Empty;

}