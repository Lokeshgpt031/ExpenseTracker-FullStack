using System;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Extensions;

public static class EnumValidationExtensions
{
    /// <summary>
    /// Validates if the provided string value is a valid enum value
    /// </summary>
    /// <typeparam name="T">The enum type</typeparam>
    /// <param name="value">The string value to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    public static bool IsValidEnum<T>(this string value) where T : struct, Enum
    {
        return Enum.TryParse<T>(value, true, out _);
    }

    /// <summary>
    /// Validates if the provided integer value is a valid enum value (backward compatibility)
    /// </summary>
    /// <typeparam name="T">The enum type</typeparam>
    /// <param name="value">The integer value to validate</param>
    /// <returns>True if valid, false otherwise</returns>
    public static bool IsValidEnum<T>(this int value) where T : struct, Enum
    {
        return Enum.IsDefined(typeof(T), value);
    }

    /// <summary>
    /// Validates if the provided value is a valid UserRole
    /// </summary>
    public static bool IsValidUserRole(this string value)
    {
        return value.IsValidEnum<UserRole>();
    }

    /// <summary>
    /// Validates if the provided value is a valid UserRole (backward compatibility)
    /// </summary>
    public static bool IsValidUserRole(this int value)
    {
        return value.IsValidEnum<UserRole>();
    }

    /// <summary>
    /// Validates if the provided value is a valid EarningType
    /// </summary>
    public static bool IsValidEarningType(this string value)
    {
        return value.IsValidEnum<EarningType>();
    }

    /// <summary>
    /// Validates if the provided value is a valid EarningType (backward compatibility)
    /// </summary>
    public static bool IsValidEarningType(this int value)
    {
        return value.IsValidEnum<EarningType>();
    }

    /// <summary>
    /// Validates if the provided value is a valid PaymentMethod
    /// </summary>
    public static bool IsValidPaymentMethod(this string value)
    {
        return value.IsValidEnum<PaymentMethod>();
    }

    /// <summary>
    /// Validates if the provided value is a valid PaymentMethod (backward compatibility)
    /// </summary>
    public static bool IsValidPaymentMethod(this int value)
    {
        return value.IsValidEnum<PaymentMethod>();
    }

    /// <summary>
    /// Validates if the provided value is a valid ExpenseCategory
    /// </summary>
    public static bool IsValidExpenseCategory(this string value)
    {
        return value.IsValidEnum<ExpenseCategory>();
    }

    /// <summary>
    /// Validates if the provided value is a valid ExpenseCategory (backward compatibility)
    /// </summary>
    public static bool IsValidExpenseCategory(this int value)
    {
        return value.IsValidEnum<ExpenseCategory>();
    }


    /// <summary>
    /// Gets all valid enum values with their display names
    /// </summary>
    /// <typeparam name="T">The enum type</typeparam>
    /// <returns>Dictionary of enum value and display name</returns>
    public static Dictionary<string, string> GetEnumDisplayNames<T>() where T : struct, Enum
    {
        var result = new Dictionary<string, string>();
        var enumType = typeof(T);

        foreach (T enumValue in Enum.GetValues(enumType))
        {
            var field = enumType.GetField(enumValue.ToString());
            var displayAttribute = field?.GetCustomAttributes(typeof(System.ComponentModel.DataAnnotations.DisplayAttribute), false)
                .FirstOrDefault() as System.ComponentModel.DataAnnotations.DisplayAttribute;

            var displayName = displayAttribute?.Name ?? enumValue.ToString();
            result.Add(enumValue.ToString(), displayName);
        }

        return result;
    }

    /// <summary>
    /// Gets all valid enum values with their display names (backward compatibility for integer-based)
    /// </summary>
    /// <typeparam name="T">The enum type</typeparam>
    /// <returns>Dictionary of enum integer value and display name</returns>
    public static Dictionary<int, string> GetEnumDisplayNamesAsInt<T>() where T : struct, Enum
    {
        var result = new Dictionary<int, string>();
        var enumType = typeof(T);

        foreach (T enumValue in Enum.GetValues(enumType))
        {
            var field = enumType.GetField(enumValue.ToString());
            var displayAttribute = field?.GetCustomAttributes(typeof(System.ComponentModel.DataAnnotations.DisplayAttribute), false)
                .FirstOrDefault() as System.ComponentModel.DataAnnotations.DisplayAttribute;

            var displayName = displayAttribute?.Name ?? enumValue.ToString();
            result.Add(Convert.ToInt32(enumValue), displayName);
        }

        return result;
    }
}
