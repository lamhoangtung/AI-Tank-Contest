#pragma once
#include "MyTank.h"

class MyTank;

class GoalDodgePosition : public GoalComposite<MyTank>
{
public:
	GoalDodgePosition(MyTank* pOwner);
	~GoalDodgePosition();

	void Activate() override;
	int Process() override;
	void Terminate() override;
};