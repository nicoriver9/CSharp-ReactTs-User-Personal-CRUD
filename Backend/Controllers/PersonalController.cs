using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PersonalController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PersonalController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Listar todos los registros
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var personalList = await _context.Personal.ToListAsync();
        return Ok(personalList);
    }

    // Agregar un nuevo registro
    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> AddPersonal([FromBody] Personal personal)
    {
        _context.Personal.Add(personal);
        await _context.SaveChangesAsync();
        return Ok(personal);
    }

    // Desactivar un registro
    [HttpPost("deactivate/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeactivatePersonal(int id)
    {
        var personal = await _context.Personal.FindAsync(id);
        if (personal == null)
        {
            return NotFound("Personal not found");
        }

        personal.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok($"Personal with ID {id} has been deactivated");
    }

    // Activar un registro
    [HttpPost("activate/{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> ActivatePersonal(int id)
    {
        var personal = await _context.Personal.FindAsync(id);
        if (personal == null)
        {
            return NotFound("Personal not found");
        }

        personal.IsActive = true;
        await _context.SaveChangesAsync();

        return Ok($"Personal with ID {id} has been activated");
    }

    // Modificar un registro
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> UpdatePersonal(int id, [FromBody] Personal updatedPersonal)
    {
        var personal = await _context.Personal.FindAsync(id);
        if (personal == null)
        {
            return NotFound("Personal not found");
        }

        personal.ApellidoNombre = updatedPersonal.ApellidoNombre;
        personal.Dni = updatedPersonal.Dni;
        personal.Cuil = updatedPersonal.Cuil;
        personal.Clas = updatedPersonal.Clas;
        personal.Anio = updatedPersonal.Anio;
        personal.Esc = updatedPersonal.Esc;
        personal.Area = updatedPersonal.Area;
        personal.Direccion = updatedPersonal.Direccion;
        personal.Numero = updatedPersonal.Numero;
        personal.Antiguedad = updatedPersonal.Antiguedad;
        personal.FechaIngreso = updatedPersonal.FechaIngreso;
        personal.IsActive = updatedPersonal.IsActive;

        await _context.SaveChangesAsync();

        return Ok(personal);
    }
}
