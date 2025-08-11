code = """ret 4"""

import sys, os, re

#expected form of a C program, without line breaks
source_re = r"int main\s*\(\s*\)\s*{\s*return\s+(?P<ret>[0-9]+)\s*;\s*}" 

# Use 'main' instead of '_main' if not on OS X
assembly_format = """    
    .globl main
_main:
    movl    ${}, %eax
    ret
"""

source = code.strip()
match = re.match(source_re, source)

# extract the named "ret" group, containing the return value
retval = match.group('ret') 
print(assembly_format.format(retval))
