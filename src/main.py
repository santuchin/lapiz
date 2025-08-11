from dataclasses import dataclass

@dataclass
class If:
	condition: Expression
	body: list[Statement]
	else_body: list[Statement]
