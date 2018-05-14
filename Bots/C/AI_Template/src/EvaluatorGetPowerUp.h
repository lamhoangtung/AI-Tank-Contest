#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorGetPowerUp : public GoalEvaluator
{
public:
	EvaluatorGetPowerUp(float bias) :GoalEvaluator(bias)
	{}
	~EvaluatorGetPowerUp();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};