package selenium.tests;


import static org.junit.Assert.*;

import java.util.List;
import java.util.Scanner;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;

import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.github.bonigarcia.wdm.ChromeDriverManager;
import java.io.*;

public class SlackSelenium {
	
	private static WebDriver driver;
	private static String username;
	private static String password;
	
	@BeforeClass
	public static void setUp() throws Exception {
		// driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		
		try {
            
            FileReader fileReader = new FileReader("credentials.txt");
            BufferedReader bufferedReader = new BufferedReader(fileReader);

            username = bufferedReader.readLine();
            password = bufferedReader.readLine();
            
            bufferedReader.close();         
        }
        catch(Exception ex){
        	ex.printStackTrace();
        } 
	}

	@AfterClass
	public static void tearDown() throws Exception {
		driver.close();
		driver.quit();
	}

	
	//Selenium Base Test
	@Test
	public void postMessage()
	{
		Scanner in = new Scanner(System.in);
		
		driver.get("https://csc510-project-group.slack.com/");
		
		// Wait until page loads and we can see a sign in button.
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		// Find email and password fields.
		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));

		// Type in our test user login info.
		email.sendKeys(username);
		pw.sendKeys(password);
		
		
		// Click
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();

		// Wait until we go to general channel.
		wait.until(ExpectedConditions.titleContains("general"));

		// Switch to #general channel and wait for it to load.
		driver.get("https://csc510-project-group.slack.com/messages/@envoprov");
		wait.until(ExpectedConditions.titleContains("envoprov"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("hello from Selenium test");
		messageBot.sendKeys(Keys.RETURN);

		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);

		WebElement msg = driver.findElement(
				By.xpath("//span[@class='message_body' and text() = 'hello world, from Selenium']"));
		assertNotNull(msg);
	}
	
	
	
}
