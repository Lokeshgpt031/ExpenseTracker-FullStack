using ExpenseTracker.API.Extensions;
using ExpenseTracker.API.Records;
using ExpenseTracker.API.Service;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExpenseResponse>>> GetExpenses(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            var userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var expenses = await _expenseService.GetExpensesAsync(userId.Value, startDate, endDate);
            return Ok(expenses);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExpenseResponse>> GetExpense(int id)
        {
            var userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var expense = await _expenseService.GetExpenseByIdAsync(id, userId.Value);
            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        [HttpPost]
        public async Task<ActionResult<ExpenseResponse>> CreateExpense([FromBody] CreateExpenseRequest request)
        {
            var userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            // Validate enum values
            if (!EnumValidationExtensions.IsValidExpenseCategory(request.Category))
            {
                return BadRequest($"Invalid expense category. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.ExpenseCategory>().Select(x => $"{x.Key}:{x.Value}"))}");
            }

            if (!EnumValidationExtensions.IsValidPaymentMethod(request.PaymentMethod))
            {
                return BadRequest($"Invalid payment method. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.PaymentMethod>().Select(x => $"{x.Key}:{x.Value}"))}");
            }

            var expense = await _expenseService.CreateExpenseAsync(userId.Value, request);
            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExpenseResponse>> UpdateExpense(int id, [FromBody] CreateExpenseRequest request)
        {
            var userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            // Validate enum values
            if (!EnumValidationExtensions.IsValidExpenseCategory(request.Category))
            {
                return BadRequest($"Invalid expense category. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.ExpenseCategory>().Select(x => $"{x.Key} - {x.Value}"))}");
            }

            if (!EnumValidationExtensions.IsValidPaymentMethod(request.PaymentMethod))
            {
                return BadRequest($"Invalid payment method. Valid values are: {string.Join(", ", EnumValidationExtensions.GetEnumDisplayNames<Models.PaymentMethod>().Select(x => $"{x.Key} - {x.Value}"))}");
            }

            var expense = await _expenseService.UpdateExpenseAsync(id, userId.Value, request);
            if (expense == null)
                return NotFound();

            return Ok(expense);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpense(int id)
        {
            var userId = User.GetCurrentUserId();
            if (userId == null) return Unauthorized();

            var result = await _expenseService.DeleteExpenseAsync(id, userId.Value);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
