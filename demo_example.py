#!/usr/bin/env python3
"""
Demo example for AI Development Environment
Pokazuje jak używać systemu w trybie offline bez zewnętrznych zależności
"""

def fibonacci(n):
    """
    Calculate Fibonacci number using recursion
    
    Args:
        n (int): Position in Fibonacci sequence
        
    Returns:
        int: Fibonacci number at position n
        
    Example:
        >>> fibonacci(5)
        5
        >>> fibonacci(10)
        55
    """
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    """
    Calculate factorial of a number
    
    Args:
        n (int): Number to calculate factorial for
        
    Returns:
        int: Factorial of n
    """
    if n <= 1:
        return 1
    return n * factorial(n-1)

class Calculator:
    """Simple calculator class for demonstration"""
    
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        """Add two numbers"""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def multiply(self, a, b):
        """Multiply two numbers"""
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def get_history(self):
        """Get calculation history"""
        return self.history

if __name__ == "__main__":
    # Demo usage
    print("AI Development Environment Demo")
    print("=" * 40)
    
    print(f"Fibonacci(10): {fibonacci(10)}")
    print(f"Factorial(5): {factorial(5)}")
    
    calc = Calculator()
    print(f"5 + 3 = {calc.add(5, 3)}")
    print(f"4 * 7 = {calc.multiply(4, 7)}")
    
    print("\nCalculation History:")
    for entry in calc.get_history():
        print(f"  {entry}")
