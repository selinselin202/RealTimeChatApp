using Microsoft.EntityFrameworkCore;
using RealTimeChat.Models;

namespace RealTimeChat.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<ChatMessage> Messages => Set<ChatMessage>();
    }
}