#include "Regulator.h"
#include "Globals.h"

Regulator::~Regulator()
{
}

bool Regulator::isReady() const
{
	return (Globals::GetLoopCount() % m_iNumLoopsToUpdate) == 0;
}
