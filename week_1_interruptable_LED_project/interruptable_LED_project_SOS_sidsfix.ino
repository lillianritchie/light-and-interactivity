int intensity = 255;
int change = 1;
int pushButton = 7;

void setup() {
  Serial.begin(9600);
  pinMode(pushButton, INPUT);
}

void loop() {

  if (intensity <= 0) {
//    change = abs(change) / 2;
change = 1;
  }
  if (intensity >= 255) {
//    change = -abs(change) * 2;
change = -2;
  }

  if (digitalRead(pushButton) == HIGH ) {
    intensity = intensity + change * 2;
  } else if (digitalRead(pushButton) == LOW) {
    intensity = intensity + change / 2;
  }

intensity = intensity + change;

  float result = sineFade(intensity, 0, 255);
  analogWrite(5, result);
  delay(5);
  Serial.println(result);
}

float sineFade(int inValue, int minValue, int maxValue) {
  float angle = map(inValue, minValue, maxValue, 0, 179);
  float result = (sin((angle * PI / 180) + PI / 2) + 1) * 127.5;
  return result;
}
