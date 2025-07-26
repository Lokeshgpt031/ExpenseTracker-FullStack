using System;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace ExpenseTracker.API.Attributes;

public class ValidEnumAttribute : ValidationAttribute
{
    private readonly Type _enumType;
    public ValidEnumAttribute(Type enumType)
    {
        _enumType = enumType ?? throw new ArgumentNullException(nameof(enumType));
        if (!_enumType.IsEnum) throw new ArgumentException("Type must be an enum", nameof(enumType));
    }
    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value == null)
        {
            return ValidationResult.Success;
        }

        // Handle both string and enum values
        if (value is string stringValue)
        {
            if (Enum.TryParse(_enumType, stringValue, true, out _))
            {
                return ValidationResult.Success;
            }
        }
        else if (value.GetType() == _enumType)
        {
            return ValidationResult.Success;
        }
        else if (value is int intValue)
        {
            if (Enum.IsDefined(_enumType, intValue))
            {
                return ValidationResult.Success;
            }
        }

        var validValues = GetEnumDisplayValues();
        return new ValidationResult($"Invalid {_enumType.Name}. Valid values are: {validValues}");
    }

    private string GetEnumDisplayValues()
    {
        var enumValues = new List<string>();

        foreach (var enumValue in Enum.GetValues(_enumType))
        {
            var enumName = enumValue.ToString();
            if (enumName != null)
            {
                var field = _enumType.GetField(enumName);
                var displayAttribute = field?.GetCustomAttribute<DisplayAttribute>();

                var displayName = displayAttribute?.Name ?? enumName;
                enumValues.Add($"{enumName}:{displayName}");
            }
        }

        return string.Join(", ", enumValues);
    }
}
