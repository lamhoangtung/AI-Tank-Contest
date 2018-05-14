#pragma once
class Regulator
{
public:
	Regulator(int u):m_iNumLoopsToUpdate(u)
	{}
	~Regulator();

	bool isReady() const;

private:
	int m_iNumLoopsToUpdate;
};

