using System.Text;
using System.Text.Json.Serialization;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});
builder.Services.AddDbContext<ExpenseTrackerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ??
                     "Data Source=EarningTracker.db"));

var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
var issuer = jwtSettings["Issuer"] ?? "EarningTrackerApi";
var audience = jwtSettings["Audience"] ?? "EarningTrackerApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

});
builder.Services.AddAuthorization();

builder.Services.AddTransient<IJwtService, JwtService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IEarningService, EarningService>();
builder.Services.AddTransient<IExpenseService, ExpenseService>();
builder.Services.AddTransient<IAnalyticsService, AnalyticsService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()    // Allow any origin
            .AllowAnyMethod()    // Allow any HTTP method (GET, POST, etc.)
            .AllowAnyHeader();   // Allow any header
    });
});


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "Earning Tracker API",
        Version = "v1",
        Description = "API for tracking daily earnings and expenses for auto drivers, plumbers, electricians, etc.",
        Contact = new() { Email = "lokeshgptmbnr@outlook.com", Name = "Lokesh" }
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Scheme = "bearer",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "JWT Authorization header using the Bearer scheme. Enter your token in the text input below.",
        Name = "Authorization"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Earning Tracker API V1");
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication(); // Add this before UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.MapGet("/health-check", () =>
Results.Ok("Healthy!")).WithDisplayName("Health Check").WithOpenApi();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ExpenseTrackerDbContext>();
    await SeedDatabase(context);
}
app.Run();




async Task SeedDatabase(ExpenseTrackerDbContext context)
{
    // Apply any pending migrations
    await context.Database.MigrateAsync();

    // Seed sources if they don't exist
    if (!await context.Sources.AnyAsync())
    {
        var sources = new[]
        {
            new Source { Name = "Uber", Description = "Earnings from Uber rides" },
            new Source {Name="Rapido", Description = "Earnings from Rapido rides"},
            new Source { Name = "Ola", Description = "Earnings from Ola rides" },
            new Source { Name = "Local Rides", Description = "Earnings from local rides" },
            new Source {Name="Electrical Work", Description = "Earnings from electrical work"},
            new Source { Name = "Plumbing Work", Description = "Earnings from plumbing work" },
            new Source { Name = "Other", Description = "Other earnings" }

        };

        await context.Sources.AddRangeAsync(sources);
        await context.SaveChangesAsync();
    }
}