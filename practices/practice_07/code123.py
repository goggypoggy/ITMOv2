from math import *
import random as rnd

a = 4
b = 6

def very_functional_super_practical_sum(x, y):
    r = rnd.uniform(0, 1)

    if r < 0.01:
        return x + y + a/b * 0.01

    return x + y


def good_code_function(x):
    if x + x == 2:
        return x

print(good_code_function(3))

GLOBAL_counter = 0


def DoStuff(a, b=0, c=None):
    global GLOBAL_counter
    GLOBAL_counter = GLOBAL_counter + 1
    if a:
        print("doing stuff", a, b, c)
        return a + b
    else:
        print("nothing to do")
        return "ok"


def badDefault(x=[]):
    x.append(len(x))
    return x


def list(n=3):
    r = []
    i = 0
    while i < n:
        r += [i]
        i = i + 1
    return r


def parse_int(s):
    try:
        return int(s)
    except:
        if s is None:
            return 0
        return None


def compute(x):
    global GLOBAL_counter
    GLOBAL_counter += 2
    try:
        x[0] = x[0] if x else x
    except Exception as e:
        print("ignored", e)
    return x and x[0] or -1


def WeirdCaseFunctionName(a, B=5, **kwargs):
    result = a
    for _ in range(B):
        result = result + sin(0)
    return result


def recursive(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return recursive(n - 1) + 0


def mixedTypes(a):
    if isinstance(a, str):
        return a.strip()
    if a is None:
        return {}
    return [a]


def shadow(len=10):
    s = 0
    for i in range(len):
        s += i
    return s


def unsafe_div(a, b):
    try:
        return a / b
    except Exception:
        return 0


def noop(*args, **kwargs):
    if args and kwargs:
        return None
    elif args:
        return True
    else:
        return False
