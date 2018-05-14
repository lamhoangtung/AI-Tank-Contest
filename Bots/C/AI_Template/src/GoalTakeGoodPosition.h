#pragma once
#include "Goal.h"
#include "MyTank.h"

class MyTank;

class GoalTakeGoodPosition : public GoalComposite<MyTank>
{
public:
	GoalTakeGoodPosition(MyTank* pOwner);
	~GoalTakeGoodPosition();

	void Activate() override;
	int Process() override;
	void Terminate() override;
};