#pragma once
#include "Goal.h"
#include "MyTank.h"

class MyTank;

class GoalGetPowerUp : public GoalComposite<MyTank>
{
public:
	GoalGetPowerUp(MyTank* pOwner);
	~GoalGetPowerUp();

	void Activate() override;
	int Process() override;
	void Terminate() override;
};
