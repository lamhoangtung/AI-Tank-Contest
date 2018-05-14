#pragma once
#include <glm/detail/type_vec2.hpp>
#include "GoalComposite.h"
#include "MyTank.h"

class MyTank;

class GoalGoToPosToAttackEnemy : public GoalComposite<MyTank>
{
public:
	GoalGoToPosToAttackEnemy(MyTank* pOwner, glm::vec2 d);

	void Activate() override;
	int Process() override;
	void Terminate() override;
private:
	glm::vec2 m_vTargetPosition;
};