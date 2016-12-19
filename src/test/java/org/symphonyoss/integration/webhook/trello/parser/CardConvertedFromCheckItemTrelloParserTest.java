package org.symphonyoss.integration.webhook.trello.parser;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import com.symphony.api.pod.model.ConfigurationInstance;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;
import org.symphonyoss.integration.webhook.exception.WebHookParseException;

import java.io.IOException;

/**
 * Test class to validate {@link CardConvertedFromCheckItemTrelloParser}
 * Created by ecarenho on 09/09/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class CardConvertedFromCheckItemTrelloParserTest extends CommonTrelloTest {

  @InjectMocks
  private CardConvertedFromCheckItemTrelloParser parser = new CardConvertedFromCheckItemTrelloParser();

  private ConfigurationInstance instance = new ConfigurationInstance();

  @Before
  public void setup() {
    String optionalProperties = "{ \"notifications\": [\"convertToCardFromCheckItem\"] }";
    instance.setOptionalProperties(optionalProperties);
  }

  @Test
  public void testCardConvertedFromCheckItemWithoutEmail() throws IOException,
      WebHookParseException {
    JsonNode rootNode = getJsonFile("payload_trello_card_from_checkitem.json");
    assertTrue(parser.filterNotifications(instance, rootNode));

    String result = parser.parse(instance, rootNode);
    assertNotNull(result);

    String expected = readFile("payload_trello_card_from_checkitem_expected_message.xml");
    assertEquals(expected, result);
  }

  @Test
  public void testIgnoreNotification() throws IOException {
    String optionalProperties = "{ \"notifications\": [\"listCreated\"] }";
    instance.setOptionalProperties(optionalProperties);

    JsonNode rootNode = getJsonFile("payload_trello_card_from_checkitem.json");
    assertFalse(parser.filterNotifications(instance, rootNode));
  }

}
