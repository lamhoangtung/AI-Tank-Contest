#pragma once

#include "easywsclient.hpp"

// Helper functions
std::wstring EncodeUnicode(unsigned char number);
std::wstring EncodeUInt8(unsigned char number);
std::wstring EncodeFloat32(float number);
unsigned char DecodeUnicode(const std::vector<uint8_t>& data, int& offset);
unsigned char DecodeUInt8(const std::vector<uint8_t>& data, int& offset);
unsigned short DecodeUInt16(const std::vector<uint8_t>& data, int& offset);
short DecodeInt16(const std::vector<uint8_t>& data, int& offset);
float DecodeFloat32(const std::vector<uint8_t>& data, int& offset);