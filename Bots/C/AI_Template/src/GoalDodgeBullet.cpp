#include "GoalDodgeBullet.h"
#include "GoalType.h"
#include "GoalMoveToPosition.h"
#include "HelperFunctions.h"

GoalDodgeBullet::~GoalDodgeBullet()
{
}


GoalDodgeBullet::GoalDodgeBullet(MyTank* pOwner):GoalComposite(pOwner, goal_dodge_bullet)
{
}

void GoalDodgeBullet::Activate()
{
//	std::cout << "Inside goal dodge bullet.\n";
	m_iStatus = active;
	RemoveAllSubgoals();
	glm::vec2 bestDirToDodge = m_pOwner->GetBestDirToDodgeDangerBullet();
	if (bestDirToDodge != glm::vec2())
	{
		glm::vec2 posToDodge = m_pOwner->GetPosition() + bestDirToDodge * m_pOwner->GetSpeed();
		m_pOwner->GetSteering()->SetTarget(posToDodge);
		m_pOwner->GetSteering()->SeekOn();
		m_pOwner->MoveOn();
//		PrintVector("Tank pos: ", m_pOwner->GetPosition());
//		PrintVector("Best dir to dodge: ", bestDirToDodge);
	}
}

int GoalDodgeBullet::Process()
{
	ActivateIfInactive();
	m_iStatus = ProcessSubgoals();
	ReactivateIfFailed();
	return m_iStatus;
}

void GoalDodgeBullet::Terminate()
{
	m_pOwner->GetSteering()->SeekOff();
	m_pOwner->MoveOff();
}
