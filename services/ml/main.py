from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class BudgetInput(BaseModel):
    income: float
    expenses: list

@app.post("/optimize")
def optimize_budget(data: BudgetInput):
    total_expense = sum(data.expenses)
    savings = data.income - total_expense

    suggestion = "Good savings habit"
    if savings < 0:
        suggestion = "Reduce spending immediately"

    return {
        "total_expense": total_expense,
        "savings": savings,
        "suggestion": suggestion
    }