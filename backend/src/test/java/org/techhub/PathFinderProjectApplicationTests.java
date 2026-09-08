package org.techhub;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class PathFinderProjectApplicationTests {

	@Test
	void contextLoads() {
		org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
		System.out.println(">>> BCRYPT_POONAM_123=" + encoder.encode("Poonam@123"));
	}

}
