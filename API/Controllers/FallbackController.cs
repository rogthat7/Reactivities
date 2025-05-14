using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[AllowAnonymous]
[Route("api/[controller]")]
public class FallbackController : Controller
{
    public IActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory()
        , "wwwroot", "index.html"), "text/HTML");
    }
}
