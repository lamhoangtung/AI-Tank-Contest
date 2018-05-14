#pragma once
#include "GoalEvaluator.h"
#include "MyTank.h"

class MyTank;

class EvaluatorTakeGoodPosition : public GoalEvaluator
{
public:
	EvaluatorTakeGoodPosition(float bias) :GoalEvaluator(bias)
	{}
	~EvaluatorTakeGoodPosition();

	float CalculateDesirability(MyTank* pTank) override;
	void SetGoal(MyTank* pTank) override;
};