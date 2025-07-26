using System;

namespace ExpenseTracker.API.Exceptions;

public class InvalidSourceException : Exception
{
    public int InvalidSourceId { get; }
    public List<SourceInfo> ValidSources { get; }

    public InvalidSourceException(int invalidSourceId, List<SourceInfo> validSources) 
        : base($"Source with ID {invalidSourceId} does not exist or is inactive.")
    {
        InvalidSourceId = invalidSourceId;
        ValidSources = validSources.OrderBy(a => a.Id).ToList();
    }

    public InvalidSourceException(int invalidSourceId, List<SourceInfo> validSources, string message) 
        : base(message)
    {
        InvalidSourceId = invalidSourceId;
        ValidSources = validSources;
    }

    public InvalidSourceException(int invalidSourceId, List<SourceInfo> validSources, string message, Exception innerException) 
        : base(message, innerException)
    {
        InvalidSourceId = invalidSourceId;
        ValidSources = validSources;
    }
}

public record SourceInfo(int Id, string Name, string Description);
