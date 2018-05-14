#pragma once
#include "MyTank.h"
#include "GoalType.h"

class MyTank;

class GoalDefendBase : GoalComposite<MyTank>
{
public:
	GoalDefendBase(MyTank* pOwner):GoalComposite(pOwner, goal_defend_base)
	{}
	~GoalDefendBase();

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
};

