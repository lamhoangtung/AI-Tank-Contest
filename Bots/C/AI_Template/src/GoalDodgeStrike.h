#pragma once
#include "MyTank.h"

class MyTank;

class GoalDodgeStrike : public GoalComposite<MyTank>
{
public:
	GoalDodgeStrike(MyTank* pOwner);
	~GoalDodgeStrike();

	void Activate() override;
	int Process() override;
	void Terminate() override;

private:
	glm::vec2 CalculateBestPosToRunAway(glm::vec2 strikePos);
};