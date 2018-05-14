#pragma once
#include "GoalComposite.h"
#include "MyTank.h"

class MyTank;

class GoalCover : public GoalComposite<MyTank>
{
public:
	GoalCover(MyTank* pOwner, std::vector<glm::vec2> targets);
	~GoalCover();

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	std::vector<glm::vec2> m_vTargetsToCoverFrom;
};