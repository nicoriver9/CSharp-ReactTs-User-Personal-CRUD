public class Personal
{
    public int Id { get; set; }
    public string ApellidoNombre { get; set; } = string.Empty;
    public string Dni { get; set; } = string.Empty;
    public string Cuil { get; set; } = string.Empty;
    public string Clas { get; set; } = string.Empty;
    public int Anio { get; set; } 
    public string Esc { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public int Numero { get; set; }
    public int Antiguedad { get; set; }
    public DateTime FechaIngreso { get; set; }
    public bool IsActive { get; set; } = true;
}