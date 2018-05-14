#pragma once
#include "GoalComposite.h"
#include "GoalType.h"

class MyTank;

class GoalAttackSideBase : GoalComposite <MyTank>
{
public:
	GoalAttackSideBase(MyTank* pOwner):GoalComposite(pOwner, goal_attack_side_base)
	{}
	~GoalAttackSideBase();

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
};

