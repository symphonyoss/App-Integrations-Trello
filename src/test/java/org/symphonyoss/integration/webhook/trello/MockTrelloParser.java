package org.symphonyoss.integration.webhook.trello;

import com.fasterxml.jackson.databind.JsonNode;
import org.symphonyoss.integration.model.config.IntegrationInstance;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParser;
import org.symphonyoss.integration.webhook.trello.parser.TrelloParserException;

import java.util.Arrays;
import java.util.List;

/**
 *
 * This class is being used to simulate the behaviour when the integration doesn't know how to
 * handle the event received.
 * Created by crepache on 15/06/17.
 */
public class MockTrelloParser implements TrelloParser {

  private static final String TEST_EVENT = "testEvent";

  @Override
  public List<String> getEvents() {
    return Arrays.asList(TEST_EVENT);
  }

  @Override
  public boolean filterNotifications(IntegrationInstance instance, JsonNode payload) {
    return false;
  }

  @Override
  public String parse(IntegrationInstance instance, JsonNode node)
      throws TrelloParserException {
    return null;
  }

  @Override
  public void setTrelloUser(String trelloUser) {}

}
