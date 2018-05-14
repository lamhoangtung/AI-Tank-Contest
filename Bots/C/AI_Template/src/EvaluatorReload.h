#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorReload : public GoalEvaluator
{
public:
	EvaluatorReload(float bias) :GoalEvaluator(bias)
	{}
	~EvaluatorReload();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};
